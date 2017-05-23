﻿#pragma strict

var anim : Animator;

//************************************
// variables de Salud
//************************************
var Salud: int;
var SaludMaxima: int;
var BarraDeVida: GameObject;

//************************************
// variables de dialogo
//************************************
var ha_hablado: boolean;
var hablando: boolean;
var NPC: GameObject;
//***********************************
// variables de estado de personaje
//***********************************

private var Agachado: boolean;
private var cargaDash: int;
private var tiempoPostDash: int;
private var tiempoDisparo: int;
private var cargaSalto: int;

//************************************
// variables de desplazamiento lateral
//************************************

private var Frenando: boolean;
var movimientoDer : KeyCode;
var movimientoIzq : KeyCode;
public var facing_right: boolean;
var veloc : float;       //en 2 esta bien

//******************
//variables de salto
//******************
var DeteccionPiso : GameObject;
var WhatIsGround: LayerMask;
var col : Collision2D;
var Salto : KeyCode;
var CooldownDeteccionSuelo: int;
var recien_aterrizado: boolean;
var en_piso : boolean;
private var fin_elevation_jump: boolean;
private var saltoNatural: boolean;
var timer: float = 0;
var tiemp_salto: float;   //en 0.5 esta bien


//*******************
//variables de ataque
//*******************
var rellenoBasico:GameObject;
var rellenoEmbestida:GameObject;
var rellenoDisparo:GameObject;
var rellenoAereo:GameObject;
var esp: GameObject;
var scim: GameObject;
var espada: GameObject;
var scimitara: GameObject;
var estocada: GameObject;
var marcadorDash: GameObject;
var slash: GameObject;
var nivel: GameObject;
var armaCargadaDistancia:boolean;
var armaCargadaBasico:boolean;
var armaCargadaAereo:boolean;
var armaCargadaMovimiento:boolean;
var ataques: boolean;
var cooldownDistancia:int;
var cooldownBasico:int;
var cooldownAereo:int;
var cooldownMovimiento:int;
var combo: int;
var sword_offset: Vector3; //distancia de la espada a el pj
var spawn_position: Vector3;


//***************************************************************
//***************************************************************
//                      Inicializacion
//***************************************************************
//***************************************************************

function Start (){
    BarraDeVida = GameObject.Find("SaludJugador");
    rellenoBasico = GameObject.Find("RellenoBasico");
    rellenoEmbestida = GameObject.Find("RellenoEmbestida");
    rellenoDisparo = GameObject.Find("RellenoDisparo");
    rellenoAereo = GameObject.Find("RellenoAereo");
    anim = GetComponent(Animator);
    fin_elevation_jump = true;
    en_piso = false;
    facing_right = true;
    hablando = false;
    ha_hablado = false;
    cargaSalto = 0;
    Agachado = false;
    armaCargadaDistancia = true;
    recien_aterrizado = false;
    ActualizarBarraDeVida();
}

//***************************************************************
//***************************************************************
//                      Ciclo Principal
//***************************************************************
//***************************************************************

function Update () {


    var Velocidad_horizontal = GetComponent.<Rigidbody2D>().velocity.x;
    if (tiempoPostDash > 0){
        tiempoPostDash = tiempoPostDash -1;
        if (tiempoDisparo <= 0){
            Frenando = false;
        }
    }
    if (tiempoDisparo > 0){
        tiempoDisparo = tiempoDisparo -1;
        if (tiempoDisparo <= 0){
            Frenando = false;
        }
    }

    DeteccionDeCaida();
    DeteccionDelSuelo();    

    if (Agachado == true){
        cargaSalto = cargaSalto -1;
        if (Velocidad_horizontal < 0){
            GetComponent.<Rigidbody2D>().velocity.x = Velocidad_horizontal + 0.1f;
        }
        else if (Velocidad_horizontal > 0){
            GetComponent.<Rigidbody2D>().velocity.x = Velocidad_horizontal - 0.1f;
        }
        if (cargaSalto <= 0){
            upSword();
            Agachado = false;
        }
    }
    else {
        MovimientoRegular();
    }
    ModuloDeCooldowns();
    
}


//
// Detectar Caida
// 

function DeteccionDeCaida(){
//
// Detectar Caida
//
    var Velocidad_vertical = GetComponent.<Rigidbody2D>().velocity.y;
    if (Velocidad_vertical < -0.1){ 
        en_piso = false;
        anim.SetBool("Crouch", false);
        anim.SetBool("Cayendo", true);
        Agachado = false;
    }
//
}

//
// Detectar Piso
// 

function DeteccionDelSuelo(){

    if (CooldownDeteccionSuelo <= 0){        
        en_piso = Physics2D.OverlapCircle(DeteccionPiso.transform.position,0.059,WhatIsGround);
        if (en_piso){
            recien_aterrizado = false;
            anim.SetBool("Cayendo", false);
            fin_elevation_jump = false; 
            anim.SetBool("Salto", false);
            anim.SetBool("Cayendo", false);
            anim.SetBool("Uppercut", false);
            saltoNatural = false; 
    
        }
    }
    else{
        CooldownDeteccionSuelo -= 1; 
    }
}

function ModuloDeCooldowns(){
    if (armaCargadaMovimiento == false){
        rellenoEmbestida.transform.position.y += 0.00333f;
        cooldownMovimiento = cooldownMovimiento -1;
        if (cooldownMovimiento == 30){
           anim.SetBool("PostDash", false);
        }
        if (cooldownMovimiento <= 0){
            armaCargadaMovimiento = true;
        }
    }
    if (armaCargadaDistancia == false){
        rellenoDisparo.transform.position.y += 0.00333f;
        cooldownDistancia = cooldownDistancia -1;
        if (cooldownDistancia == 40){
           anim.SetBool("SlashHaciaAbajo", false);
        }
        if (cooldownDistancia <= 0){
            armaCargadaDistancia = true;
        }
    }
    if (armaCargadaBasico == false){
        rellenoBasico.transform.position.y += 0.00333f;
        cooldownBasico = cooldownBasico -1;
        if (cooldownBasico <= 0){
            armaCargadaBasico = true;
        }
    }
    if (armaCargadaAereo == false){
        rellenoAereo.transform.position.y += 0.00333f;
        cooldownAereo = cooldownAereo -1;
        if (cooldownAereo <= 0){
            armaCargadaAereo = true;
        }
    }

}
//***************************************************************
//***************************************************************
//                    Movimiento regular
//***************************************************************
//***************************************************************
function MovimientoRegular(){

    var Velocidad_vertical = GetComponent.<Rigidbody2D>().velocity.y;
    var Velocidad_horizontal = GetComponent.<Rigidbody2D>().velocity.x;
    //******************
    //Movimiento lateral
    //******************
    if (Frenando){ 
        if (Velocidad_horizontal < 0){
            GetComponent.<Rigidbody2D>().velocity.x = Velocidad_horizontal + 0.05f;
        }
        else if (Velocidad_horizontal > 0){
            GetComponent.<Rigidbody2D>().velocity.x = 0;
            GetComponent.<Rigidbody2D>().velocity.x = Velocidad_horizontal - 0.05f;
        }        
    }else{
        if (Input.GetKey(movimientoDer)){
            anim.SetBool("Mov_lateral", true);
            GetComponent.<Rigidbody2D>().velocity.x = veloc;
            if (transform.localScale.x<0){
                transform.localScale.x = Mathf.Abs(transform.localScale.x);
                facing_right = true;            
            }
        
        }
        else if (Input.GetKey(movimientoIzq)){
            anim.SetBool("Mov_lateral", true);
            GetComponent.<Rigidbody2D>().velocity.x = veloc*(-1);
            if (transform.localScale.x>0){
                transform.localScale.x = (transform.localScale.x)*(-1);
                facing_right = false;
            }
        }
        else {
            anim.SetBool("Mov_lateral", false);
            GetComponent.<Rigidbody2D>().velocity.x = 0;
        }
    }    
    InteractuarNPC();
    SaltoNatural();
    AtaquesEspada();

}
//*****
//Interactuar
//*****
function InteractuarNPC(){
    //********
    //Dialogo
    //********
    if (ha_hablado){
        if (Mathf.Abs(NPC.transform.position.x - transform.position.x)>0.5){
            hablando = false;     
        }
    }
    if (Input.GetButtonDown("Arriba")){
        if (!hablando){
            for(var npc : GameObject in GameObject.FindGameObjectsWithTag("NPC")){
                if (Mathf.Abs(npc.transform.position.x - transform.position.x)<0.25){
                    ha_hablado = true;
                    hablando = true;
                    npc.GetComponent(NPC1).hablando = true;
                    NPC = npc;
                    break;
                }
            }
        }
        else{ 
            NPC.GetComponent(NPC1).pag_dialogo = NPC.GetComponent(NPC1).pag_dialogo + 1;
        
        }
    }
}
//*****
//Salto
//*****
function SaltoNatural(){
    if ((Input.GetButtonDown("Jump"))&&(en_piso)){
        timer = 0;
        transform.position = transform.position + Vector3(0,0.01,0);        
        GetComponent.<Rigidbody2D>().velocity.y = 4;
        en_piso = false;
        recien_aterrizado = true;
        fin_elevation_jump = false;
        saltoNatural = true;
        CooldownDeteccionSuelo = 10;
        anim.SetBool("Salto", true);
    } 
    
    //Durante salto
    
    if ((!en_piso)&&(!fin_elevation_jump)&&(saltoNatural)){
        timer += Time.deltaTime;
        
        if (Input.GetButtonUp("Jump")){
            GetComponent.<Rigidbody2D>().velocity.y = 0;
            fin_elevation_jump = true;
        }
        
        //else if (timer<0.3){
        //    rigidbody2D.velocity.y = 3;
        //}
        
        else if (timer>=0.3) {
            GetComponent.<Rigidbody2D>().velocity.y = 0;
            fin_elevation_jump = true;    
        }
    }    
}
//***************************************************************
//***************************************************************
//                          Ataques
//***************************************************************
//***************************************************************
function AtaquesEspada(){
    
    //Ataque espada basica
    
    if (Input.GetButtonDown("AtaqueBasico")){
        if (armaCargadaBasico){  
            rellenoBasico.transform.position.y -= 0.2;
            anim.SetBool("AtaqueBasico", true);
            anim.SetBool("Uppercut", false);
            anim.SetBool("SlashHaciaAbajo", false);
            basicSword();
            armaCargadaBasico = false;
            cooldownBasico = 60;

        }
    } 
    
    //ataque espada movimiento
    
    if (Input.GetButtonDown("AtaqueDeMovimiento")){
        if (armaCargadaMovimiento){           
            rellenoEmbestida.transform.position.y -= 0.2;
            anim.SetBool("Uppercut", false);
            anim.SetBool("AtaqueBasico", false);
            anim.SetBool("SlashHaciaAbajo", false);
            dashSword();
            armaCargadaMovimiento = false;
            cooldownMovimiento = 60;
        }
    } 
    
    if (Input.GetButtonDown("AtaqueDeLevante")){
        if (en_piso){
            rellenoAereo.transform.position.y -= 0.2;
            anim.SetBool("AtaqueBasico", false);
            anim.SetBool("SlashHaciaAbajo", false);
            anim.SetBool("Crouch", true);
            cargaSalto = 30;
            Agachado = true;
            armaCargadaAereo = false;
            cooldownAereo = 60;
        }
    } 
    
    if (Input.GetButtonDown("AtaqueADistancia")){
        if (armaCargadaDistancia){ 
            rellenoDisparo.transform.position.y -= 0.2;
            anim.SetBool("SlashHaciaAbajo", true);
            anim.SetBool("Uppercut", false);
            anim.SetBool("AtaqueBasico", false);
            SwordShot();
            tiempoDisparo = 15;
            Frenando = true;
            armaCargadaDistancia = false;
            cooldownDistancia = 60;
        }
    } 
}

function basicSword(){

    if (facing_right){
        sword_offset = Vector3(0.25, 0,0);
        spawn_position = transform.position;
        spawn_position = spawn_position + sword_offset;
        Destroy(esp);
        esp = Instantiate(estocada, spawn_position, Quaternion.identity);
        esp.transform.parent = transform;
    }
    else if (!(facing_right)){
        sword_offset = Vector3(-0.25, 0,0);
        spawn_position = transform.position;
        spawn_position = spawn_position + sword_offset;
        Destroy(esp);
        esp = Instantiate(estocada, spawn_position, Quaternion.identity);
        esp.transform.parent = transform;
        esp.transform.localScale.x = (transform.localScale.x)*(-1);
    }
}
    
function dashSword(){
    if (facing_right){
        sword_offset = Vector3(0, 0,0);
        spawn_position = transform.position;
        spawn_position = spawn_position + sword_offset;
        Destroy(esp);
        esp = Instantiate(marcadorDash, spawn_position, Quaternion.identity);
    }
    else if (!(facing_right)){
        sword_offset = Vector3(-0, 0,0);
        spawn_position = transform.position;
        spawn_position = spawn_position + sword_offset;
        Destroy(esp);
        esp = Instantiate(marcadorDash, spawn_position, Quaternion.identity);
        esp.transform.localScale.x = (transform.localScale.x)*(-1);
    }
}
    
function upSword(){     

    anim.SetBool("Crouch", false);
    anim.SetBool("Uppercut", true);
    GetComponent.<Rigidbody2D>().velocity.y = 5;
    recien_aterrizado = true;
    en_piso = false;
    fin_elevation_jump = false;
    CooldownDeteccionSuelo = 10;
    if (facing_right){
        sword_offset = Vector3(0.23, 0.10,0);
        spawn_position = transform.position;
        spawn_position = spawn_position + sword_offset;
        Destroy(esp);
        esp = Instantiate(espada, spawn_position, Quaternion.identity);
        esp.transform.position.z = 1;
        esp.transform.parent = transform;
    }
    else if (!(facing_right)){
        sword_offset = Vector3(-0.23, 0.10,0);
        spawn_position = transform.position;
        spawn_position = spawn_position + sword_offset;
        Destroy(esp);
        esp = Instantiate(espada, spawn_position, Quaternion.identity);
        esp.transform.position.z = 1;
        esp.transform.parent = transform;
        esp.transform.localScale.x = (transform.localScale.x)*(-1);
    }    
} 
 
function SwordShot(){

    var scimi_offset: Vector3;
    var spawn_position_scimi: Vector3;
    if (facing_right){
        sword_offset = Vector3(0.29, -0.01,0);
        scimi_offset = Vector3(0.25, -0.06,0);
        spawn_position = transform.position;
        spawn_position = spawn_position + sword_offset;
        spawn_position_scimi = transform.position;
        spawn_position_scimi = spawn_position_scimi + scimi_offset;
        Destroy(esp);
        Destroy(scim);
        esp = Instantiate(slash, spawn_position, Quaternion.identity);
        scim = Instantiate(scimitara, spawn_position_scimi, Quaternion.identity);
        scim.transform.parent = transform;
    }
    else if (!(facing_right)){
        sword_offset = Vector3(-0.29, -0.01,0);
        scimi_offset = Vector3(-0.25, -0.06,0);
        spawn_position = transform.position;
        spawn_position = spawn_position + sword_offset;
        spawn_position_scimi = transform.position;
        spawn_position_scimi = spawn_position_scimi + scimi_offset;
        Destroy(esp);
        Destroy(scim);
        esp = Instantiate(slash, spawn_position, Quaternion.identity);
        esp.transform.localScale.x = (transform.localScale.x)*(-1);
        scim = Instantiate(scimitara, spawn_position_scimi, Quaternion.identity);
        scim.transform.parent = transform;
        scim.transform.localScale.x = (transform.localScale.x)*(-1);


    }
 
    
}  
function ActualizarBarraDeVida() {
    BarraDeVida.transform.position.x += ((0.2f)*(Salud)); 
    
}  


//***************************************************************
//***************************************************************
//                          Colisiones
//***************************************************************
//***************************************************************


function OnCollisionEnter2D(col: Collision2D) {

}  
function OnTriggerEnter2D (other : Collider2D) {

}

