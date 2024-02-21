var Cliente = require('../models/Cliente');
var bcrypt = require('bcrypt-nodejs');
var jwt_cliente = require('../helpers/jwt-cliente')
var jwt = require('jwt-simple');

var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');


const registro_cliente_admin = async function (req, res) {

    if (req.user) {
        let data = req.body;

        try {

            var clientes = await Cliente.find({ email: data.email });

            bcrypt.hash('123456789', null, null, async function (err, hash) {
                if (err) {
                    res.status(200).send({ data: undefined, message: 'No se pudo generar la contraseña.' });
                } else {
                    if (clientes.length >= 1) {
                        res.status(200).send({ data: undefined, message: 'El correo electrónico ya existe.' });
                    } else {
                        data.fullnames = data.nombres + ' ' + data.apellidos;
                        data.password = hash;
                        let cliente = await Cliente.create(data);
                        enviar_correo_verificacion(cliente.email);
                        res.status(200).send({ data: cliente });
                    }
                }
            });

        } catch (error) {
            console.log(error);
            res.status(200).send({ data: undefined, message: 'Verifique los campos del formulario.' });
        }
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const validar_correo_verificacion = async function (req, res) {
    var token_params = req.params['token'];
    var token = token_params.replace(/['"]+/g, '');

    var segment = token.split('.');


    if (segment.length != 3) {
        return res.status(403).send({ message: 'InvalidToken' });
    } else {
        try {
            var payload = jwt.decode(token, 'oscar2024');
            await Cliente.findByIdAndUpdate({ _id: payload.sub }, {
                verify: true
            });
            res.status(200).send({ data: true });
        } catch (error) {
            console.log(error);
            return res.status(200).send({ message: 'El correo de verificación expiró', data: undefined });
        }
    }

}

const listar_clientes_admin = async function (req, res) {
    if (req.user) {
        let filtro = req.params['filtro'];
        let clientes = await Cliente.find({
            $or: [
                { nombres: new RegExp(filtro, 'i') },
                { apellidos: new RegExp(filtro, 'i') },
                { n_doc: new RegExp(filtro, 'i') },
                { email: new RegExp(filtro, 'i') },
                { fullnames: new RegExp(filtro, 'i') }
            ]
        });
        res.status(200).send({ data: clientes });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const obtener_datos_cliente_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];

        try {
            let cliente = await Cliente.findById({ _id: id }).populate('asesor');
            res.status(200).send({ data: cliente });
        } catch (error) {
            res.status(200).send({ data: undefined });
        }

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const editar_cliente_admin = async function (req, res) {

    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        let cliente = await Cliente.findByIdAndUpdate({ _id: id }, {
            nombres: data.nombres,
            apellidos: data.apellidos,
            fullnames: data.nombres + '' + data.apellidos,
            genero: data.genero,
            email: data.email,
            telefono: data.telefono,
            n_doc: data.n_doc,
            pais: data.pais,
            ciudad: data.ciudad,
            nacimiento: data.nacimiento
        });

        res.status(200).send({ data: cliente });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const listar_clientes_modal_admin = async function (req, res) {
    if (req.user) {
        let filtro = req.params['filtro'];
        let clientes = await Cliente.find({
            $or: [
                { nombres: new RegExp(filtro, 'i') },
                { apellidos: new RegExp(filtro, 'i') },
                { n_doc: new RegExp(filtro, 'i') },
                { email: new RegExp(filtro, 'i') },
                { fullnames: new RegExp(filtro, 'i') }
            ]
        }).select('_id fullnames nombres apellidos email verify tipo');
        res.status(200).send({ data: clientes });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

//////////////////////////////////////////////////////////////////

const enviar_correo_verificacion = async function (email) {
    var readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'oscaroeps30@gmail.com',
            name: 'muestra',
            pass: 'ydqbvvvvyykojfst'

        }
    }));

    //OBTENER CLIENTE
    var cliente = await Cliente.findOne({ email: email });
    var token = jwt_cliente.createToken(cliente);

    readHTMLFile(process.cwd() + '/mails/account_verify.html', (err, html) => {

        let rest_html = ejs.render(html, { token: token });

        var template = handlebars.compile(rest_html);
        var htmlToSend = template({ op: true });

        var mailOptions = {
            from: 'oscaroeps30@gmail.com',
            to: email,
            subject: 'Verificación de cuenta',
            html: htmlToSend
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                console.log('Email sent: ' + info.response);
            }
        });

    });
}

module.exports = {
    registro_cliente_admin,
    validar_correo_verificacion,
    listar_clientes_admin,
    obtener_datos_cliente_admin,
    editar_cliente_admin,
    listar_clientes_modal_admin
}