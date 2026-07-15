import {
    IsNotEmpty,
    IsString,
  } from "class-validator";
  
  export class ValidateKeyDto {
  
    @IsString()
    @IsNotEmpty()
    apiKey: string;
  
  }