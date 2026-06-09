/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function handler(req: any, res: any) {
  res.status(200).json({ status: "running", time: new Date().toISOString() });
}
