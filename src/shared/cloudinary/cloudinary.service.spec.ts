import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';

export const mockUploadedFile = {
  fieldname: 'img',
  originalname: 'test.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('test'),
  size: 4,
  stream: null,
  path: null,
  destination: null,
  filename: null,
};

export const mockCloudinaryRepository = {
  uploadFile: jest.fn().mockResolvedValue({
    secure_url: 'test',
  }),
};

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryRepository,
        },
      ],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Upload a file
  it('should upload a file', async () => {
    const file = await service.uploadFile(mockUploadedFile);
    expect(file).toEqual({ secure_url: 'test' });
  });
});
