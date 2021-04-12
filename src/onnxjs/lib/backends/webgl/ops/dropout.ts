// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import {Dropout} from '../../../ops/dropout';
import {Tensor} from '../../../tensor';
import {WebGLInferenceHandler} from '../inference-handler';
import {ProgramInfo, RunData, WebGLOperator} from '../types';

export class WebGLDropout extends Dropout implements WebGLOperator {
  run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[] {
    if (this.testMode) {
      return [inputs[0]];
    }
    throw new Error(`Non test mode Dropout is not implemented yet`);
  }
  createProgramInfo(handler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo {
    throw new Error(`Non test mode Dropout is not implemented yet`);
  }
  createRunData(handler: WebGLInferenceHandler, programInfo: ProgramInfo, inputs: Tensor[]): RunData {
    throw new Error(`Non test mode Dropout is not implemented yet`);
  }
}
