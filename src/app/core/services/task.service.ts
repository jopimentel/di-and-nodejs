import { ITaskService } from './interfaces';
import { Schema, model, Model, Document } from 'mongoose';
import { injectable, inject } from 'tsyringe';

export class TaskService implements ITaskService {

    private schema: Schema
    private permission: Model<IPermission>;

    constructor() {
        this.schema = new Schema({
            Id: String,
            Name: String,
            Type: Number,
            Description: String,
            IsDefault: Boolean,
            TenantId: String,
            Comment: String,
            Created: Date,
            CreatedBy: String,
            Updated: Date,
            UpdatedBy: String,
            IsDeleted: Boolean,
            DeletedToken: String,
            Version: Number,
            LockById: String
        }, {
            collection: 'permission'
        });

        this.permission = model('permission', this.schema);
    }

    public async get(name: any): Promise<any> {
        return await this.permission.find({ Name: name });
    }
}

export interface IPermission extends Document {
    Id: string;
    Name: string;
    Type: number;
    Description: string;
    IsDefault: boolean;
    TenantId: string;
    Comment: string;
    Created: Date;
    CreatedBy: string;
    Updated: Date;
    UpdatedBy: string;
    IsDeleted: boolean;
    DeletedToken: string;
    Version: number;
    LockById: string
}