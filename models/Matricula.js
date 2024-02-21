var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MatriculaSchema = Schema({

    cliente: { type: Schema.ObjectId, ref: 'cliente', required: false },
    asesor: { type: Schema.ObjectId, ref: 'colaborador', required: false },
    origen: { type: String, required: true },
    monto: { type: Number, required: true },
    matricula: { type: Number, required: true },
    canal: { type: String, required: true },
    descuento: { type: Number, required: true },
    dia: { type: String, required: true },
    mes: { type: String, required: true },
    year: { type: String, required: true },
    cupon: { type: String, required: false },
    estado: { type: String, required: true },

    renovacion: { type: Schema.ObjectId, ref: 'matricula', required: false },
    renovacion_b: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('matricula', MatriculaSchema)