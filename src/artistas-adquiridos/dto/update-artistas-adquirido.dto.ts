import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistasAdquiridoDto } from './create-artistas-adquirido.dto';

export class UpdateArtistasAdquiridoDto extends PartialType(CreateArtistasAdquiridoDto) {}
