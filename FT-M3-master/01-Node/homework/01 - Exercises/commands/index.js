const fs = require("fs");
const utils = require("../utils/request");
const process = require("process");

function pwd(print) {
    print(process.cwd());
}

function date(print) {
    print(Date());
}

function echo(print, args) {
    print(args);
}

function ls(print) {
    fs.readdir(".", (error,files) => {
        if(error){
            throw error;
        }else{
            print(files.join(' '));
        };
    })
}

function cat(print, args) {
    fs.readFile(args, 'utf-8', (error, data) => {
        if(error){
            throw error;
        }else{
            print(data);
        };
    })
}

function head(print, args) {
    fs.readFile(args, 'utf-8', (error, data) => {
        if(error){
            throw error;
        }else{
            print(data.slice(0,data.indexOf('\n')));
        };
    })
}

function tail(print, args) {
    fs.readFile(args, 'utf-8', (error, data) => {
        if(error){
            throw error;
        }else{
            print(data.slice(data.lastIndexOf(' ')+1));
        };
    })
}

function curl(print, args) {
    utils.request(args, (error, response) => {
        if(error){
            throw error;
        }else{
            print(response);
        };     
    })
}

module.exports = {pwd, date, echo, ls, cat, head, tail, curl};
