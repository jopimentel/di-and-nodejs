import { DependencyContainer } from 'tsyringe';
import { Express } from 'express';
import { Mongoose } from 'mongoose';

export interface IConfiguration {
    baseUrl: string;
    httpPort: number;
}