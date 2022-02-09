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

    testWorldPayloadProcess(user: any, world: any, payload: any): any { //FIX ME

        for (const userObjKey in user.userObjs) {
            if (payload.action == 'keydown') {
                if (payload.data == 'KeyA') {
                    world[user.userObjs[userObjKey]].objX = world[user.userObjs[userObjKey]].objX - 1;
                }
            
                if (payload.data == 'KeyD') {
                    world[user.userObjs[userObjKey]].objX = world[user.userObjs[userObjKey]].objX + 1;
                }
    
                if (payload.data == 'KeyW') {
                    world[user.userObjs[userObjKey]].objY = world[user.userObjs[userObjKey]].objY - 1;
                }
            
                if (payload.data == 'KeyS') {
                    world[user.userObjs[userObjKey]].objY = world[user.userObjs[userObjKey]].objY + 1;
                }
            
            }
        }
        
        return world;
    }

}
