import { Test, TestingModule } from '@nestjs/testing';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';

describe('BlockController', () => {
  let blockController: BlockController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlockController],
      providers: [BlockService],
    }).compile();

    blockController = app.get<BlockController>(BlockController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(blockController.getHello()).toBe('Hello World!');
    });
  });
});
