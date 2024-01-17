import { Injectable } from '@nestjs/common';
import siteInfo from '@blog/server/config/site.default.config';
import { DynamicConfig, DynamicConfigDocument } from '@blog/server/models/dynamic.config.model';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty, isEqual } from 'lodash';
import { isDevMode } from '@blog/server/config/index.config';
import { publicPath, staticAssetsPath } from '@blog/server/utils/path.util';
import path from 'path';
import { Model } from 'mongoose';
import fs from 'fs-extra';

export const CONFIG_KEY = 'app-config';

const config = {
    ...siteInfo,
};

@Injectable()
export class DynamicConfigService {
    _config: DynamicConfig = new DynamicConfig();
    isHasfavicon = true;
    constructor(@InjectModel(DynamicConfig.name) private readonly configModel: Model<DynamicConfigDocument>) {
        configModel.findOne({ key: CONFIG_KEY }).then(async (res) => {
            if (isEmpty(res)) {
                const data = await configModel.create({
                    key: CONFIG_KEY,
                    ...config,
                });
                return this.setConfig(data.toObject());
            }
            return this.setConfig(res.toObject());
        });
    }

    get config(): DynamicConfig {
        return this._config;
    }

    setConfig(data) {
        this._config = data;
        return this._config;
    }

    setIsHasfavicon(bool: boolean) {
        this.isHasfavicon = bool;
    }

    async updateConfig(data) {
        if (!isEmpty(data.siteLogo)) {
            const siteLogo = await this.handleSiteLogoUrl(data);
            Object.assign(data, {
                siteLogo,
            });
        }
        await this.configModel.updateOne({ key: CONFIG_KEY }, data);
        const res = await this.configModel.findOne({ key: CONFIG_KEY });
        this.setConfig(res.toObject());
        return this.config;
    }

    /**
     * if it is development mode, do not use domain
     * if it is production mode, use // replace http(s)://
     */
    get siteDomain(): string {
        if (isDevMode) {
            return '';
        }
        return '//' + this.config.siteDomain;
    }

    async handleSiteLogoUrl(data) {
        const oldPath = path.normalize(data.siteLogo.replace(this.siteDomain, publicPath));
        const copyAimPath = path.normalize(staticAssetsPath + '/logo.svg');
        if (isEqual(oldPath, copyAimPath)) {
            return data.siteLogo;
        }
        await fs.copy(oldPath, copyAimPath);
        return this.siteDomain + '/static/logo.svg';
    }
}
