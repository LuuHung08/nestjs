import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HealthService {
  constructor(private httpService: HttpService) {}

  async checkAPIs() {
    const apiEndpoints = ['http://localhost:3000/products'];

    const results = [];

    for (const endpoint of apiEndpoints) {
      try {
        const response = await firstValueFrom(this.httpService.get(endpoint));
        results.push({ endpoint, status: response.status, message: 'OK' });
      } catch (error) {
        results.push({
          endpoint,
          status: error.response?.status || 500,
          message: error.message,
        });
      }
    }

    return results;
  }
}
