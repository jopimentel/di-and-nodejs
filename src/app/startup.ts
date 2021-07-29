import { Express } from 'express';
import { inject, injectable, container } from 'tsyringe';
import { IConfiguration } from 'configuration.interface';
import { TasksController } from './controllers';
import { TaskService } from './core/services';
import mongoose from 'mongoose';

@injectable()
export class Startup {

    private http: Express;

    constructor(@inject('IConfiguration') public configuration: IConfiguration) { }

    public build(express: Express): Startup {
        return this
            .configure(express)
            .registerDependencies()
            .mapRoutes()
            .addDbConnection();
    }

    private configure(http: Express): Startup {
        this.http = http;

        return this;
    }

    private registerDependencies(): Startup {
        container.register('ITaskService', { useClass: TaskService }, { lifecycle: 3 });

        return this;
    }

    private mapRoutes(): Startup {
        const baseUrl: string = this.configuration.baseUrl;
        const tasksUrl: string = `${baseUrl}/tasks`;

        this.http.use((request, response, next) => {

            if (request.url.startsWith(tasksUrl)) {
                const tasksController = container.resolve(TasksController);
                this.http.use(tasksUrl, tasksController.router);
            }

            next();
        });

        return this;
    }

    private addDbConnection(): Startup {
        mongoose
            .connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false', {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                dbName: 'nindo'
            }).then(db => console.log('Database connection was established succesfully'))
            .catch(error => console.log(error.message));

        return this;
    }

}
