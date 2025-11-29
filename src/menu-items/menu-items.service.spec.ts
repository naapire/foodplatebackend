import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemService } from './menu-items.service';

describe('MenuItemsService', () => {
  let service: MenuItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuItemService],
    }).compile();

    service = module.get<MenuItemService>(MenuItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
