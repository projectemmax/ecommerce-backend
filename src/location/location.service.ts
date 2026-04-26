/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LocationService {

    private baseUrl = 'https://psgc.gitlab.io/api';

    async getRegions() {
        const res = await axios.get(`${this.baseUrl}/regions`);
        return res.data;
    }

    async getCitiesByRegion(regionCode: string) {
        const res = await axios.get(
            `${this.baseUrl}/regions/${regionCode}/cities-municipalities`
        );
        return res.data;
    }

    async getProvinces(regionCode: string) {
        const res = await axios.get(
        `${this.baseUrl}/regions/${regionCode}/provinces`
        );
        return res.data;
    }

    async getCities(provinceCode: string) {
        const res = await axios.get(
        `${this.baseUrl}/provinces/${provinceCode}/cities-municipalities`
        );
        return res.data;
    }

    async getBarangays(cityCode: string) {
        const res = await axios.get(
        `${this.baseUrl}/cities-municipalities/${cityCode}/barangays`
        );
        return res.data;
    }

}