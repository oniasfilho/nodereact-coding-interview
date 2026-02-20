import {
  JsonController,
  Get,
  HttpCode,
  NotFoundError,
  Param,
  QueryParam,
} from "routing-controllers";
import { PeopleProcessing } from "../services/people_processing.service";

const peopleProcessing = new PeopleProcessing();

@JsonController("/people", { transformResponse: false })
export default class PeopleController {
  @HttpCode(200)
  @Get("/all")
  getAllPeople(
    @QueryParam("page") page: number = 1,
    @QueryParam("limit") limit: number = 10,
  ) {
    const people = peopleProcessing.getAll();

    if (!people) {
      throw new NotFoundError("No people found");
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
    const start = (pageNum - 1) * limitNum;
    const data = people.slice(start, start + limitNum);

    return {
      data,
      total: people.length,
      page: pageNum,
      limit: limitNum,
    };
  }

  @HttpCode(200)
  @Get("/name")
  getPeopleByName(@QueryParam("query") query: string) {
    const people = peopleProcessing.getAll();
    const normalized = (query ?? "").trim().toLowerCase();
    const data = people.filter((p) =>
      `${p.first_name.toLowerCase()} ${p.last_name.toLowerCase()}`.includes(
        normalized,
      ),
    );
    return { data };
  }

  @HttpCode(200)
  @Get("/:id")
  getPerson(@Param("id") id: number) {
    const person = peopleProcessing.getById(id);

    if (!person) {
      throw new NotFoundError("No person found");
    }

    return {
      data: person,
    };
  }
}
