import {Component, Inject, Injectable} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {ExtractingSiteNode, ExtractorDto} from "../factory-planner-api";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import {add, sum} from "lodash";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatSliderModule} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

export enum Purity {
  Impure = 'Impure',
  Normal = 'Normal',
  Pure = 'Pure'
}

export const PurityModifier: Record<Purity, number> = {
  [Purity.Impure]: 0.5,
  [Purity.Normal]: 1,
  [Purity.Pure]: 2
}

export interface ExtractionNode {
  purity: Purity
  overclockProfile: number,
}

@Injectable({
  providedIn: "root"
})
export class ExtractingSiteService {
  calculateExtractingSpeed(extractor: ExtractorDto, purity: Purity, overclockPercentage: number): number {
    if (overclockPercentage <= 0 && overclockPercentage > 250) {
      throw new Error('Invalid overclock setting')
    }
    const cyclePerMinute = 60 / extractor.extractCycleTime
    const itemPerMinute = extractor.itemsPerCycle * cyclePerMinute

    return (PurityModifier[purity] * overclockPercentage) / 100 * itemPerMinute
  }

  getNodesOptions(): Purity[] {
    return Object.keys(Purity) as unknown as Purity[]
  }
}
