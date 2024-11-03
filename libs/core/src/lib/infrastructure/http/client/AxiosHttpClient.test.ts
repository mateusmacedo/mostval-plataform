import axios from 'axios';

import { AxiosHttpClient } from './AxiosHttpClient';

jest.mock('axios');

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient;
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    jest.clearAllMocks();
    sut = new AxiosHttpClient({ baseUrl: 'http://mocked' });
  });

  it('should call POST method correctly', async () => {
    const expects = 'hue';
    mockedAxios.request.mockResolvedValue({
      status: 201,
      data: expects,
    });
    const response = await sut.post('success', { aa: 'bb' });
    expect(response).toEqual({
      success: true,
      value: expects,
    });
    expect(mockedAxios.request).toHaveBeenCalledWith({
      ...sut['clientConfig'],
      method: 'post',
      url: 'success',
      data: { aa: 'bb' },
      headers: { ...sut['clientConfig'].headers },
    });
  });

  it('should call GET method correctly', async () => {
    const expects = 'hue';
    mockedAxios.request.mockResolvedValue({
      status: 200,
      data: expects,
    });
    const response = await sut.get('success/123');
    expect(response).toEqual({
      success: true,
      value: expects,
    });
    expect(mockedAxios.request).toHaveBeenCalledWith({
      ...sut['clientConfig'],
      method: 'get',
      url: 'success/123',
      headers: { ...sut['clientConfig'].headers },
    });
  });

  it('should call PUT method correctly', async () => {
    const expects = 'hue';
    mockedAxios.request.mockResolvedValue({
      status: 200,
      data: expects,
    });
    const response = await sut.put('success/123', { aa: 'bb' });
    expect(response).toEqual({
      success: true,
      value: expects,
    });
    expect(mockedAxios.request).toHaveBeenCalledWith({
      ...sut['clientConfig'],
      method: 'put',
      url: 'success/123',
      data: { aa: 'bb' },
      headers: { ...sut['clientConfig'].headers },
    });
  });

  it('should call DELETE method correctly', async () => {
    const expects = 'hue';
    mockedAxios.request.mockResolvedValue({
      status: 200,
      data: expects,
    });
    const response = await sut.delete('success/123');
    expect(response).toEqual({
      success: true,
      value: expects,
    });
    expect(mockedAxios.request).toHaveBeenCalledWith({
      ...sut['clientConfig'],
      method: 'delete',
      url: 'success/123',
      headers: { ...sut['clientConfig'].headers },
    });
  });

  it('should call PATCH method correctly', async () => {
    const expects = 'hue';
    mockedAxios.request.mockResolvedValue({
      status: 200,
      data: expects,
    });
    const response = await sut.patch('success/123', { aa: 'bb' });
    expect(response).toEqual({
      success: true,
      value: expects,
    });
    expect(mockedAxios.request).toHaveBeenCalledWith({
      ...sut['clientConfig'],
      method: 'patch',
      url: 'success/123',
      data: { aa: 'bb' },
      headers: { ...sut['clientConfig'].headers },
    });
  });

  it('should return error when request fails', async () => {
    const errorResponse = {
      response: {
        status: 500,
        data: 'Erro Interno',
      },
    };
    mockedAxios.request.mockRejectedValue(errorResponse);
    const response = await sut.get('failure/123');
    expect(response).toEqual({
      success: false,
      error: errorResponse,
    });
    expect(mockedAxios.request).toHaveBeenCalledWith({
      ...sut['clientConfig'],
      method: 'get',
      url: 'failure/123',
      headers: { ...sut['clientConfig'].headers },
    });
  });

  it('should use custom headers when provided', async () => {
    const expects = 'hue';
    const customHeaders = { Authorization: 'Bearer token' };
    mockedAxios.request.mockResolvedValue({
      status: 200,
      data: expects,
    });
    const response = await sut.get('custom-headers', customHeaders);
    expect(response).toEqual({
      success: true,
      value: expects,
    });
    expect(mockedAxios.request).toHaveBeenCalledWith({
      ...sut['clientConfig'],
      method: 'get',
      url: 'custom-headers',
      headers: { ...sut['clientConfig'].headers, ...customHeaders },
    });
  });

  it('should configure interceptors when provided', () => {
    const requestInterceptor = jest.fn();
    const responseInterceptor = jest.fn();

    new AxiosHttpClient({
      requestInterceptor,
      responseInterceptor,
    });

    expect(axios.interceptors.request.use).toHaveBeenCalledWith(requestInterceptor);
    expect(axios.interceptors.response.use).toHaveBeenCalledWith(responseInterceptor);
  });
});
