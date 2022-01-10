import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CacheTTL, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class WorldService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {

    }

    async setCache(key: string, value: any) {
        this.cacheManager.set(key, value);
    }

    async getCache(key: string): Promise<any> {
        return await this.cacheManager.get(key);
    }

    testWorldPayloadProcess(world: any, payload: any): any {

        if (payload.action == 'keydown' && payload.token) {
            if (payload.data == 'a') {
                world[0].obj_x = world[0].obj_x - 1;
            }
        
            if (payload.data == 'd') {
                world[0].obj_x = world[0].obj_x + 1;
            }

            if (payload.data == 'w') {
                world[0].obj_y = world[0].obj_y - 1;
            }
        
            if (payload.data == 's') {
                world[0].obj_y = world[0].obj_y + 1;
            }
        
        }

        return world;
    }

}
