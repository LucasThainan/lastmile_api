import { Test, TestingModule } from '@nestjs/testing'
import { EntregadoresController } from './entregadores.controller'
import { EntregadoresService } from './entregadores.service'

describe('EntregadoresController', () => {
  let controller: EntregadoresController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntregadoresController],
      providers: [EntregadoresService],
    }).compile()

    controller = module.get<EntregadoresController>(EntregadoresController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
