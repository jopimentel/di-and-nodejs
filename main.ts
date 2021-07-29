import 'reflect-metadata';
import { container } from 'tsyringe';
import { Startup } from './src/app/startup';
import { Configuration } from './configuration';
import express, { Router } from 'express';

container.register('IConfiguration', { useClass: Configuration }, { lifecycle: 1 });

const app: Startup = container.resolve(Startup);
const http: express.Express = express();
const router: Router = express.Router({ mergeParams: true });
const parser = express.json({ type: 'json' });

app.build(http);
http.listen(app.configuration.httpPort, () => { console.log(`Server started at port: ${app.configuration.httpPort}`) });
