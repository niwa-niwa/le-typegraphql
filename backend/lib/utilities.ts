import { Response, Request } from "express";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime";
import { PARAMS } from "../../consts/url";
import { config } from "../../consts/config";
import { Message, User, Village } from "@prisma/client";
import { CustomError } from "../../backend/classes/CustomError";

/**
 * for graphql request to send JSON-String
 * ex) { name : { contains : "village_A" , } , } convert to "{ \"name\" : { \"contains\" : \"village_A\" , } , }
 * @param obj
 * @returns
 */
export function toJsonString(obj: { [key: string]: any }): string {
  const j_str: string = JSON.stringify(obj).replace(/\"/g, '\\"');

  return j_str;
}

export type ErrorObject = {
  code: number;
  message: string;
};

/**
 * for response error message to frontend
 * @param code
 * @param message
 * @returns
 */
export function genErrorObj(
  code: ErrorObject["code"],
  message: ErrorObject["message"]
): ErrorObject {
  return {
    code,
    message,
  };
}

export function sendError(res: Response, e: unknown): void {
  console.error(e);
  // console.log(e); // for testing

  if (e instanceof CustomError) {
    res.status(e.code).json(genErrorObj(e.code, e.message));
    return;
  }

  if (e instanceof PrismaClientValidationError) {
    res.status(400).json(genErrorObj(400, "Incorrect your request."));
    return;
  }

  if (e instanceof PrismaClientKnownRequestError) {
    res
      .status(400)
      .json(genErrorObj(400, "Not found record with your request."));
    return;
  }

  res.status(500).json(genErrorObj(500, "Internal Server Error"));
}

export type ResponseHeader = { [key: string]: number };

/**
 * generate record information
 * @param count
 * @param par_page
 * @returns
 */
export function genResponseHeader(
  count: number,
  par_page: ReturnType<typeof parseParPage>
): ResponseHeader {
  let total_pages: number = 1;

  if (par_page && count > par_page) {
    total_pages = Math.ceil(count / par_page);
  }

  return {
    [PARAMS.X_TOTAL_COUNT]: count,
    [PARAMS.X_TOTAL_PAGE_COUNT]: total_pages,
  };
}

/**
 * generate pagination as link
 * @param page
 * @param total_page
 * @param url
 * @returns
 */
export function genLinksHeader(
  page: number,
  total_page: number,
  url: string
): { next: string; prev: string } {
  // if url had not page parameter, it would be added page parameter
  if (url.indexOf(`${PARAMS.PAGE}=`) === -1) {
    if (url.indexOf("?", url.lastIndexOf("/")) === -1) {
      url += `?${PARAMS.PAGE}=${page}`;
    } else {
      url += `&${PARAMS.PAGE}=${page}`;
    }
  }

  const next: string =
    total_page > page
      ? url.replace(`${PARAMS.PAGE}=${page}`, `${PARAMS.PAGE}=${page + 1}`)
      : "";

  const prev: string =
    page > 1
      ? url.replace(`${PARAMS.PAGE}=${page}`, `${PARAMS.PAGE}=${page - 1}`)
      : "";

  return { next, prev };
}

export type QArgs = {
  select?: { [key: string]: boolean } | undefined;
  orderBy?: { [key: string]: string }[] | undefined;
  take?: number | undefined;
  skip?: number | undefined;
};

/**
 * separate strings-field in a request PARAMS  with separator.
 * field = "id,name,createdAt"
 * return = {id:true,name:true,createdAt:true}
 * @param field
 * @param separator
 * @returns {id:true,name:true,createdAt:true}
 */
export function parseFields(
  field: any,
  separator: string = ","
): QArgs["select"] {
  if (!field || !field.length) return undefined;

  const fields: string[] = field.toString().split(separator);

  let fields_obj: { [key: string]: boolean } = {};

  fields.forEach((value) => {
    fields_obj[value] = true;
  });

  return fields_obj;
}

/**
 * optimize sort-string for prisma.js
 * sort = sort = "-createdAt,+updatedAt"
 * Prefix means "-" = desc, "+" = asc
 * return = [{createdAt:"desc"},{updatedAt:"asc"}]
 * @param sort
 * @param separator
 * @returns
 */
export function parseSort(
  sort: any,
  separator: string = ","
): QArgs["orderBy"] {
  if (!sort || !sort.length) return undefined;

  const sorts: string[] = sort.toString().split(separator);

  let sorts_obj: { [key: string]: string }[] = [];

  sorts.forEach((value) => {
    const key: string = value.slice(1);
    const val: string = value.charAt(0) === "-" ? "desc" : "asc";
    sorts_obj.push({
      [key]: val,
    });
  });

  return sorts_obj;
}

/**
 * optimize limit for prisma
 * limit should be number
 * @param limit
 * @returns
 */
export function parseParPage(limit: any): number | undefined {
  if (limit === 0) return undefined;

  if (!limit) return config.PAR_PAGE_DEFAULT;

  if (!isNaN(limit)) {
    if (Number(limit) === 0) return undefined;
    return Number(limit);
  }

  return config.PAR_PAGE_DEFAULT;
}

/**
 * offset should be number
 * @param offset
 * @returns
 */
export function parseOffset(offset: any): number | undefined {
  if (isNaN(offset) || !offset) return undefined;

  return Number(offset);
}

/**
 * page =  total-record / limit
 * @param page
 * @returns
 */
export function parsePage(page: any): number {
  if (isNaN(page) || !page) return 1;

  if (Number(page) < 1) return 1;

  return Number(page);
}

/**
 * calculate total skip records
 * @param par_page
 * @param page
 * @param offset
 * @returns
 */
export function calcSkipRecords(
  par_page: ReturnType<typeof parseParPage>,
  page: ReturnType<typeof parsePage>,
  offset: ReturnType<typeof parseOffset>
): QArgs["skip"] {
  let skip: number | undefined = 0;

  if (par_page !== undefined) skip = par_page * (page - 1);

  if (offset !== undefined) skip += offset;

  return skip;
}

export type QArgsAndPage<T> = {
  args: T;
  page: number;
};

/**
 * generate arguments for Prisma.js and current page number
 * @param query
 * @returns
 */
export function genQArgsAndPage(query: Request["query"]): QArgsAndPage<QArgs> {
  let args: QArgs = {};

  // extract columns
  args.select = parseFields(query[PARAMS.FIELDS]);

  // record should be the orderBy
  args.orderBy = parseSort(query[PARAMS.SORT]);

  // how many records should be in par page
  args.take = parseParPage(query[PARAMS.PAR_PAGE]);

  // where page number should return
  const page: number = args.take ? parsePage(query[PARAMS.PAGE]) : 1;

  const offset: number | undefined = parseOffset(query[PARAMS.OFFSET]);

  // how many skip records from 0
  args.skip = calcSkipRecords(args.take, page, offset);

  return { args, page };
}

/**
 * confirm the user who is a member at the village
 * @param user
 * @param the_village
 * @returns
 */
export function isVillager(
  user: Partial<User> & { villages: { id: Village["id"] }[] },
  the_village: { id: Village["id"] }
): boolean {
  const result: { id: string } | undefined = user.villages.find(
    (village: { id: Village["id"] }) => village.id === the_village.id
  );

  return !!result;
}

/**
 * confirm the user who is a owner at the village
 * @param user
 * @param the_village
 * @returns
 */
export function isOwner(
  user: Partial<User> & { ownVillages: { id: Village["id"] }[] },
  the_village: { id: Village["id"] }
): boolean {
  const result: { id: string } | undefined = user.ownVillages.find(
    (village: { id: Village["id"] }) => the_village.id === village.id
  );

  return !!result;
}

export function isMine(
  user: Partial<User> & { messages: { id: Message["id"] }[] },
  the_message: { id: Message["id"] }
): boolean {
  const result: { id: string } | undefined = user.messages.find(
    (message) => message.id === the_message.id
  );

  return !!result;
}
