import { Test, TestingModule } from '@nestjs/testing';
import { SiteConfigController } from './site-config.controller';

describe('SiteConfigController', () => {
  let controller: SiteConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiteConfigController],
    }).compile();

    controller = module.get<SiteConfigController>(SiteConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
