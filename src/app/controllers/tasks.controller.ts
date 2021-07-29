import { Request, Response, Router } from 'express';
import { inject, injectable } from 'tsyringe';
import { IController } from '../core/library/interfaces/controller.interface';
import { ITaskService } from '../core/services/interfaces';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';

@injectable()
export class TasksController implements IController {

    constructor(@inject('ITaskService') private service: ITaskService) {

    }

    public get(req: Request, res: Response): any {
        from(this.service.get(req.query.task))
            .pipe(
                tap(data => res.status(200).send(data))
            )
            .subscribe();
    }

    router: Router = Router()
        .get('/sample', (req, res) => this.get(req, res));
}