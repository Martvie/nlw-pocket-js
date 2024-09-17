import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createGoal } from "../functions/create-goal";
import { creatGoalCompletion } from "../functions/create-goal-completion";
import { getWeekPendingGoals } from "../functions/get-week-pending-goals";

const app = fastify().withTypeProvider<ZodTypeProvider>();

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.post(
    "/goals",
    {
        schema: {
            body: z.object({
                title: z.string(),
                desiredWeeklyFrequency: z.number().min(1),
            }),
        },
    },
    async (request, reply) => {
        const { title, desiredWeeklyFrequency } = request.body;

        await createGoal({
            title,
            desiredWeeklyFrequency,
        });
    }
);

app.get("/pending-goals", async (request, reply) => {
    const { pendingGoals } = await getWeekPendingGoals();

    reply.send(pendingGoals);
});

app.post(
    "/goal-completion",
    {
        schema: {
            body: z.object({
                goalId: z.string(),
            }),
        },
    },
    async (request, reply) => {
        const { goalId } = request.body;
        const result = await creatGoalCompletion({ goalId });
        reply.send(result);
    }
);

app.listen({ port: 3333 }).then(() => {
    console.log("Server Running");
});
