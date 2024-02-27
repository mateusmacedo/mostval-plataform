import axios from 'axios';
import { AxiosHttpClient } from './AxiosHttpClient';

jest.mock('axios');

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient;
  beforeAll(() => {
    sut = new AxiosHttpClient({ baseUrl: 'http://mocked' });
  });

  it('should call the correct request post method', async () => {
    const expects = { status: 201, data: 'hue' };
    (axios.request as jest.Mock).mockResolvedValue(expects);
    const response = await sut.post('success', { aa: 'bb' });
    expect(response).toStrictEqual(expects);
  });

  it('should call the correct request get method', async () => {
    const expects = { status: 200, data: 'hue' };
    (axios.request as jest.Mock).mockResolvedValue(expects);
    const response = await sut.get('success/123');
    expect(response).toStrictEqual(expects);
  });

  it('should call the correct request put method', async () => {
    const expects = { status: 200, data: 'hue' };
    (axios.request as jest.Mock).mockResolvedValue(expects);
    const response = await sut.put('success/123', { aa: 'bb' });
    expect(response).toStrictEqual(expects);
  });

  it('should call the correct request delete method', async () => {
    const expects = { status: 200, data: 'hue' };
    (axios.request as jest.Mock).mockResolvedValue(expects);
    const response = await sut.delete('success/123');
    expect(response).toStrictEqual(expects);
  });

  it('should call the correct request patch method', async () => {
    const expects = { status: 200, data: 'hue' };
    (axios.request as jest.Mock).mockResolvedValue(expects);
    const response = await sut.patch('success/123', { aa: 'bb' });
    expect(response).toStrictEqual(expects);
  });

  it('should throw when request is error', async () => {
    (axios.request as jest.Mock).mockRejectedValue(new Error('deu ruim'));
    const response = sut.get('success/123');
    await expect(response).rejects.toThrow(Error);
    await expect(response).rejects.toThrow('{"status":500,"data":"Internal Error"}');
  });
});
