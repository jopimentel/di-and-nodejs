import { DependencyContainer } from 'tsyringe';
import { IConfiguration } from './configuration.interface';
import { Express } from 'express';
import { Mongoose } from 'mongoose';

export class Configuration implements IConfiguration {
    public baseUrl: string = '/api';
    public httpPort: number = 3000;
}