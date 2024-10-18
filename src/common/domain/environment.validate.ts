import { plainToInstance } from 'class-transformer';
import { EnviromentVariableDto } from './dto/enviroment.variable.dto';
import { validateSync } from 'class-validator';

export const environmentValidate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnviromentVariableDto, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
