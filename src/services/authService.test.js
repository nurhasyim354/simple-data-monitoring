/* eslint-disable no-undef */
const bcrypt = require('bcryptjs')
const dayjs = require('dayjs')
const jwt = require('jsonwebtoken')
const UserModel = require('../repositories/models/userModel')
const Db = require('../repositories/db')
const config = require('../../config.json')
const { logger } = require('../utils')
const AuthService = require('./authService')

jest.mock('bcryptjs')
jest.mock('dayjs')
jest.mock('jsonwebtoken')
jest.mock('../repositories/models/userModel')
jest.mock('../repositories/db')


describe('AuthService', () => {

    afterEach(() => {
        jest.resetAllMocks()
    })

    test('constructor should create user model with new Db connection if not defined', () => {
        new AuthService()

        expect(Db).toHaveBeenCalledTimes(1)
        expect(Db.prototype.getConnection).toHaveBeenCalledTimes(1)
        expect(UserModel).toHaveBeenCalledWith(Db.prototype.getConnection())
    })

    test('constructor should use db connection from parameter if exist', () => {
        const mockDbPool = {};
        const mockDb = { getConnection: ()=> {
            return mockDbPool;
        }}
        new AuthService(mockDb.getConnection())

        expect(UserModel).toHaveBeenCalledWith(mockDbPool)
    })

    test('upsertUser should return error for invalid input', () => {
        
    })

    test('upsertUser should insert new user if user not found', () => {
       
    })

    test('upsertUser should update existing user if user already exists', () => {
        
    })

    test('authenticate should return error when failed to verify the token', () => {
        
    })

    test('authenticate should return error when any exception', () => {
        
    })

    test('authenticate should return login data when token is valid', () => {
        
    })

    test('login should return error when user not found', () => {
        
    })

    test('login should return error when password incorrect', () => {
        
    })

    test('login should return token successfully', () => {
        
    })

    test('authMidleware should redirect to /login when no token is not provided', () => {
        
    })

    test('authMidleware should redirect to /login when query params is not provided', () => {
        
    })

    test('authMidleware should redirect to /login when token is invalid', () => {
        
    })

    test('authMidleware should redirect to /login when token is expired', () => {
        
    })

    test('authMidleware should redirect to /login when IP address has beem changed', () => {
        
    })

    test('authMidleware should call next()', () => {
        
    })
})
