import { v4 as uuidv4 } from 'uuid';

const programa = (sequelize, DataTypes) => {
    const Programa = sequelize.define('programa', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID
        },
        nombre: {
            type: DataTypes.STRING,
            unique: false,
        },
        nivel: {
            type: DataTypes.INTEGER,
            unique: false,
        },
        tipoCiclo: {
            type: DataTypes.INTEGER,
            unique: false,
        },
        numeroMatriculas: {
            type: DataTypes.INTEGER,
            unique: false,
        },
        numeroMatriculaAlAnio: {
            type: DataTypes.INTEGER,
            unique: false,
        },
        costoMatricula: {
            type: DataTypes.STRING,
            unique: false,
        },
        numeroUma: {//Numero de UMA que tiene un programa (Es un conteo, no es moneda)
            type: DataTypes.STRING,
            unique: false,
        },
        precioUma: {
            type: DataTypes.STRING,
            unique: false,
        },
        unidadAcademica: {
            type: DataTypes.TEXT,
            unique: false,
        },
        diasImpartidos:{
            type: DataTypes.STRING,
            unique: false,
        },
        horario: {
            type: DataTypes.STRING,
            unique: false,
        },
        precioCarne: {
            type: DataTypes.TEXT,
            unique: false,
        },
        precioServicioAdmin: {
            type: DataTypes.TEXT,
            unique: false,
        },
        duracionPrograma: {
            type: DataTypes.TEXT,
            unique: false,
        },
        dimensionalDuracion: {
            type: DataTypes.INTEGER,
            unique: false,
        },
        modalidad: {
            type: DataTypes.INTEGER,
            unique: false,
        },
        pensum: {
            type: DataTypes.TEXT,
            unique: false,
        },
        palabrasClave:{
            type: DataTypes.TEXT,
            unique: false,
        },
        moneda:{
            type: DataTypes.INTEGER,
            unique: false,
        },
        correoContacto:{
            type: DataTypes.TEXT,
            unique: false,
        },
        informacionAdicional:{
            type: DataTypes.TEXT,
            unique: false,
        },
        descripcionPrograma:{
            type: DataTypes.TEXT,
            unique: false,
        },
        enfasis:{
            type: DataTypes.TEXT,
            unique: false,
        },
        username: {
            type: DataTypes.STRING,
            references: {
            model: 'users', // 'users' refers to table name
            key: 'username', // 'username' refers to column name in users table
            }
        },
        },{
        timestamps: true,
        freezeTableName: true,
        tableName: 'programas'
    });

    Programa.beforeCreate(programa => programa.id = uuidv4());
    return Programa;
  };
  
  export default programa;