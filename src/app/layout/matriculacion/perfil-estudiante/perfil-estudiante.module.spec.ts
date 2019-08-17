import { PerfilEstudianteModule } from './perfil-estudiante.module';

describe('BlankPageModule', () => {
    let blankPageModule: PerfilEstudianteModule;

    beforeEach(() => {
        blankPageModule = new PerfilEstudianteModule();
    });

    it('should create an instance', () => {
        expect(blankPageModule).toBeTruthy();
    });
});
