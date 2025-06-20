import  sqlite3  from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
dotenv.config() 



export class ContactsModel{
    private static async conectionDataBase(){
        return open({
            filename: "./database/Services.db",
            driver: sqlite3.Database
        })
    }

    static async guardadoContacto(contact: { nombre: string; correo: string; telefono: string; comentario: string; ip: string; fecha: string; pais: string }){
        const db = await this.conectionDataBase()
        await db.run("CREATE TABLE IF NOT EXISTS contacto(id INTEGER PRIMARY KEY AUTOINCREMENT, Nombre TEXT, Correo TEXT, Telefono TEXT, Mensaje TEXT, Ip TEXT, Fecha_Hora TEXT, Pais TEXT)")

        await db.run("INSERT INTO contacto(Nombre, Correo, Telefono, Mensaje, Ip, Fecha_Hora, Pais) VALUES(?, ?, ?, ?, ?, ?, ?)", 
            contact.nombre, contact.correo, contact.telefono, contact.comentario, contact.ip, contact.fecha, contact.pais
        )

        await db.close()
    }

    static async accesoContacto(){
        const db = await this.conectionDataBase();
        const contactos =  await db.all('SELECT id, Nombre, Correo, Telefono, Mensaje, Ip, Fecha_Hora, Pais FROM contacto')
        return contactos;
        await db.close()
    }

    static async guardarPago(payment: { servicio: string; monto: string; moneda: string; fecha: string; estado_pago: string}){
        const db = await this.conectionDataBase()
        await db.run("CREATE TABLE IF NOT EXISTS pagos(id INTEGER PRIMARY KEY AUTOINCREMENT, Servicio TEXT, Monto TEXT, Moneda TEXT, Fecha TEXT, Estado_Pago TEXT)")

        await db.run("INSERT INTO pagos(Servicio, Monto, Moneda, Fecha, Estado_Pago) VALUES(?, ?, ?, ?, ?)", 
            payment.servicio, payment.monto, payment.moneda, payment.fecha, payment.estado_pago
        )
        await db.close()
    }

    static async accesoPagos(){
        const db = await this.conectionDataBase();
        const pagos =  await db.all('SELECT id, Servicio, Monto, Moneda, Fecha, Estado_Pago FROM pagos')
        return pagos;
        await db.close()
    }

    static async user(){
        
        const db = await this.conectionDataBase()
        await db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password_hash TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);")
        
        const username = process.env.USER
        const password = process.env.PASSWORD

        if (!username || !password) {
            throw new Error("Las variables USER o PASSWORD no están definidas en el archivo .env");
        }

        const usuarioExistente = await db.get("SELECT * FROM users WHERE username = ?", [username]);

        if (usuarioExistente) {
            await db.close();
            return;
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.run("INSERT INTO users(username, password_hash) VALUES(?, ?)", 
            username, hashedPassword
        )

        await db.close();
    }

    

    static async getUserByUsername(username: string) {
        const db = await this.conectionDataBase();
        const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
        await db.close();
        return user;
    }





}