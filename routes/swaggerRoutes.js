const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const setupSwagger = (app) => {
  const swagger = YAML.load(
    path.join(__dirname, "../swagger/swagger.yaml")
  );

  const listingSwagger = YAML.load(
    path.join(__dirname, "../swagger/listing.yaml")
  );

  const bookingSwagger = YAML.load(
    path.join(__dirname, "../swagger/booking.yaml")
  );
  
  const authSwagger = YAML.load(
    path.join(__dirname, "../swagger/auth.yaml")
  );

  const reviewSwagger = YAML.load(
    path.join(__dirname, "../swagger/review.yaml")
  );

  const adminSwagger = YAML.load(
    path.join(__dirname, "../swagger/admin.yaml")
  );

  swagger.components = {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  };

  // // Swagger belgesinin güvenlik ayarlarını ekleme
  swagger.security = [{ bearerAuth: [] }];

  // admin.yaml'daki paths'i swagger'e ekle
  if (adminSwagger.paths) {
    swagger.paths = { ...swagger.paths, ...adminSwagger.paths };
  }

  if (authSwagger.paths) {
    swagger.paths = { ...swagger.paths, ...authSwagger.paths };
  }

  if (bookingSwagger.paths) {
    swagger.paths = { ...swagger.paths, ...bookingSwagger.paths };
  }

  if (listingSwagger.paths) {
    swagger.paths = { ...swagger.paths, ...listingSwagger.paths };
  }

  if (reviewSwagger.paths) {
    swagger.paths = { ...swagger.paths, ...reviewSwagger.paths };
  }

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));
};

module.exports = setupSwagger;
