import type { EndpointOutput } from "@sveltejs/kit/types/endpoint";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";

import Joi from "joi"
;
import { getHttpResponse, validationDetailsToError } from "$utils/helpers/request";
import { StatusCode } from "$utils/constants/httpResponse";
import { Category } from "$database";
import type { JSONValue } from "@sveltejs/kit/types/helper";

const getSchema = Joi.object({
  slug: Joi.string()
      .min(3)
      .max(128)
      .optional()
});

export async function get({ params }: ServerRequest): Promise<EndpointOutput> {
  const { slug } = params;

  const { error } = getSchema.validate(params, { allowUnknown: true });

  if (error) {
      return {
          status: StatusCode.BAD_REQUEST,
          body: {
              errors: validationDetailsToError(error.details)
          }
      }
  }

  let categoriesQuery = Category.query()
      .select()
      .orderBy('name')
      .where({ slug })
      .withGraphFetched('created_by')
      .modifyGraph('created_by', (builder) => builder.select('id', 'uuid', 'name', 'username'));

  let categories: Category[] = [];

  if (slug) {
      categoriesQuery = categoriesQuery.where({ slug });
  }

  try {
      categories = await categoriesQuery;
  } catch (e) {
      // TODO (William): Log error somewhere
      console.error(e);
      
      return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);
  }

  return {
      status: StatusCode.OK,
      body: {
          categories: categories as unknown as JSONValue,
      }
  }
}