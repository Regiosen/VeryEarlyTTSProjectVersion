﻿#pragma strict

var timer: float = 0.01;
var sword_offset: Vector3;
var fuente: GameObject;
var dash: GameObject;
var katana: GameObject;
var right: boolean;
var veloc : float;       //en 2 esta bien
var kat: GameObject;
var WhatIsWalls: LayerMask;

function Start () {

    var fuente = GameObject.Find("PJ");
    right = fuente.GetComponent(movimientoPJ).facing_right;
    if (!right){
        transform.localScale.x = (transform.localScale.x)*(-1);
    }
}

function Update () {

      //por algun motivo esto se dice dentro
                                         //de la funcion en la que se quiere usar 
    fuente = GameObject.Find("PJ");
    timer -= Time.deltaTime;
    if ((timer <= 0)&&(CheckSpace())){ 
        var katanaX;
        var katanaY;
        var katanaPosition;
        var posicionX = transform.position.x;
        if (right){
            katanaX = fuente.transform.position.x + 0.08f;
            katanaY = fuente.transform.position.y + 0.23f;
            katanaPosition = Vector3(katanaX,katanaY,1);
            Destroy(kat);
            kat = Instantiate(katana, katanaPosition, Quaternion.identity);
            kat.transform.parent = fuente.transform;
            posicionX = posicionX - 0.2f;
        }
        else if (!right){
            katanaX = fuente.transform.position.x - 0.08f;
            katanaY = fuente.transform.position.y + 0.23f;
            katanaPosition = Vector3(katanaX,katanaY,1);
            Destroy(kat);
            kat = Instantiate(katana, katanaPosition, Quaternion.identity);
            kat.transform.parent = fuente.transform;
            kat.transform.localScale.x = (transform.localScale.x)*(-1);
            posicionX = posicionX + 0.2f;

        }
        var spawn_positionX = transform.position.x + ((fuente.transform.position.x - transform.position.x)/2);
        var spawn_positionY = (transform.position.y + fuente.transform.position.y)/2;
        var spawn_position = Vector3(spawn_positionX,spawn_positionY,1);
        Instantiate(dash, spawn_position, Quaternion.identity);

        var posicionY = transform.position.y;
        var PosicionNueva = Vector3(posicionX, posicionY,0);
        fuente.transform.position = PosicionNueva;
        fuente.GetComponent(Animator).SetBool("PostDash", true);
        Destroy(gameObject);
    }
    else if ((timer <= 0)&&(!CheckSpace())){
        Destroy(gameObject);
    }
    if (right){
        GetComponent.<Rigidbody2D>().velocity.x = veloc;
    }
    else if (!right){
        GetComponent.<Rigidbody2D>().velocity.x = -veloc;
    }
}

function OnCollisionEnter2D(col: Collision2D) {
    
    if (CheckSpace()){
        var katanaX;
        var katanaY;
        var katanaPosition;
        var posicionX = transform.position.x;
        if (right){
            katanaX = fuente.transform.position.x + 0.08f;
            katanaY = fuente.transform.position.y + 0.23f;
            katanaPosition = Vector3(katanaX,katanaY,1);
            Destroy(kat);
            kat = Instantiate(katana, katanaPosition, Quaternion.identity);
            kat.transform.parent = fuente.transform;
            posicionX = posicionX - 0.2f;
        }
        else if (!right){
            katanaX = fuente.transform.position.x - 0.08f;
            katanaY = fuente.transform.position.y + 0.23f;
            katanaPosition = Vector3(katanaX,katanaY,1);
            Destroy(kat);
            kat = Instantiate(katana, katanaPosition, Quaternion.identity);
            kat.transform.parent = fuente.transform;
            kat.transform.localScale.x = (transform.localScale.x)*(-1);
            posicionX = posicionX + 0.2f;
        }
        var distanciaRecorrida = fuente.transform.position.x - transform.position.x - 0.2f;
        var spawn_positionX = transform.position.x + (distanciaRecorrida/2);
        var spawn_positionY = (transform.position.y + fuente.transform.position.y)/2;
        var spawn_position = Vector3(spawn_positionX,spawn_positionY,1);
        var dashSpawneado: GameObject;
        dashSpawneado = Instantiate(dash, spawn_position, Quaternion.identity);
        dashSpawneado.transform.localScale.x = (dash.transform.localScale.x)*(distanciaRecorrida/(1.6f));
        

        var posicionY = transform.position.y;
        var PosicionNueva = Vector3(posicionX, posicionY,0);
        fuente.transform.position = PosicionNueva;
        fuente.GetComponent(Animator).SetBool("PostDash", true);
        Destroy(gameObject);
    }
    else{
        Destroy(gameObject);
    }
}  
function CheckSpace() {
    var esquinaA :Vector2;
    var esquinaB :Vector2;
    esquinaA = Vector2(transform.position.x -0.08f,transform.position.y -0.18f);
    esquinaB = Vector2(transform.position.x +0.08f,transform.position.y +0.18f);

    if (Physics2D.OverlapArea(esquinaA,esquinaB,WhatIsWalls)){
        Debug.Log("No estoy libre");
        return false;
    }
    else{
        Debug.Log("Estoy libre");
        return true;
    }
    
}
