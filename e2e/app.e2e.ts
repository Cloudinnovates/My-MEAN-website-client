/*
 * Copyright (C) 2015-2017 Stefano Cappa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {verifyNoBrowserErrors} from './e2e_util';
import {$, ExpectedConditions, browser, by, element} from 'protractor';

// function waitForElement(selector: string) {
//   // Waits for the element with id 'abc' to be present on the dom.
//   browser.wait(ExpectedConditions.presenceOf($(selector)), 20000);
// }
describe('hello world', function() {

  // afterEach(verifyNoBrowserErrors); //add a favicon to prevent an error

  describe('hello world app', function() {
    const URL = '/';

    it('should greet', function() {
      browser.get(URL);

      browser.wait(ExpectedConditions.presenceOf($('.carousel-caption')), 20000);
      expect(element.all(by.css('.carousel-caption')).count()).toEqual(3);
    });
  });

});

// import { browser } from 'protractor';
//
// describe('App', () => {
//
//   beforeEach(() => {
//     browser.get('/');
//   });
//
//   it('should have a title', () => {
//     let subject = browser.getTitle();
//     let result  = 'My MEAN Website';
//     expect(subject).toEqual(result);
//   });
//
// });