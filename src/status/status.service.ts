import { BadRequestException, Injectable } from "@nestjs/common";
import { StatusRepository } from "./status.repository";
import { StatusEnum, StatusType } from "./domain/status.enum";
import { Product } from "../product/model/product.entity";

@Injectable()
export class StatusService {
  constructor(private readonly statusRepository: StatusRepository) {
  }

  async findOne(name: StatusType) {
    const status = await this.statusRepository.findOne(name);

    if (!status) throw new BadRequestException("status not found");

    return status;
  }

  public async productCancellation(type: "outOfStock" | "discontinued"): Promise<Partial<Product>> {

    if (type === StatusEnum.discontinued.valueOf()) {
      return {
        isActive: false,
        status: await this.statusRepository.findOne("discontinued")
      };
    }
    if (type === StatusEnum.outOfStock.valueOf()) {
      return {
        status: await this.statusRepository.findOne("outOfStock")
      };
    }

  }
}
