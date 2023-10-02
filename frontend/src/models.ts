export class Box {
  boxId?: number;
  size?: number;
  price?: number;
}

export class ResponseDto<T> {
  responseData?: T;
  messageToClient?: string;
}
