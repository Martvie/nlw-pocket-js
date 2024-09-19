import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { env } from "../env";
import { goalsRoutes } from "./routes/goals";

const app = fastify().withTypeProvider<ZodTypeProvider>();

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
    origin: `${env.CORS}`,
});

app.register(goalsRoutes);

app.listen({ port: 3333 }).then(() => {
    console.log("Server Running");
});
