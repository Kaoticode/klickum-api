import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { STATIC_SWAGGER_DOC } from "./staticSwaggerDocs";
import { resolve } from "path";
import { writeFileSync } from "fs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({ origin: "*" });

  const config = new DocumentBuilder()
    .setTitle("klickum-api-doc")
    .setDescription("klickum-api ecommerce API")
    .setVersion("1.0")
    .addTag("ecommerce")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);


  await app.listen(process.env.PORT || 3000);

  STATIC_SWAGGER_DOC();

  if (process.env.STAGE === "development") {
    const pathToSwaggerStaticFolder = resolve(process.cwd(), "src/swagger-static");

    // write swagger json file
    const pathToSwaggerJson = resolve(
      pathToSwaggerStaticFolder,
      "swagger.json"
    );
    const swaggerJson = JSON.stringify(document, null, 2);
    writeFileSync(pathToSwaggerJson, swaggerJson);
    console.log(`Swagger JSON file written to: '/swagger-static/swagger.json'`);
  }
}

bootstrap();
