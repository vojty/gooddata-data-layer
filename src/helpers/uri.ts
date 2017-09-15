export const REG_URI_OBJ = /\/gdc\/md\/(\S+)\/obj\/\d+/;

export const isUri = (identifier: string) => REG_URI_OBJ.test(identifier);
export const areUris = (identifiers: string[]) => identifiers.every(isUri);

export const wrapId = (id: string) => isUri(id) ? `[${id}]` : `{${id}}`;
