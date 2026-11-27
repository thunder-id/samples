// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * quickstarts/quickstart-react-b2b - company sign-up, the organization and roles in the token, and
 * switching between companies. Every run registers new companies, since handles and usernames are
 * unique; they stay on the server.
 */

import {SampleApps, sampleAppUrl} from '../../../shared/apps.ts';
import {newCompany} from '../../../shared/pages/b2b-gate.page.ts';
import {
  createChildOrganizationUnit,
  createDefaultOuUser,
  shareUserWithAllChildUnits,
} from '../../../shared/utils/organization-units/index.ts';
import {expect, test} from '../fixtures.ts';

const appUrl = sampleAppUrl(SampleApps.REACT_B2B);
const USER_TYPE = 'react-b2b-user';

test.describe('quickstarts/quickstart-react-b2b - Companies', () => {
  test('TC001: registering a company signs its first admin in to it', async ({b2bPage}) => {
    const company = newCompany('react-b2b');
    await b2bPage.goto(appUrl);
    await b2bPage.clickSignInButton();
    await b2bPage.registerCompany(company, 'My account belongs to this company');

    await b2bPage.verifySignedInTo(company.name);
    expect(await b2bPage.claim('ouHandle')).toBe(company.handle);
    expect(await b2bPage.claim('ouName')).toBe(company.name);
    expect(await b2bPage.claim('roles')).toContain('React B2B Admin');
    expect((await b2bPage.claim('scope')).split(' ')).toContain('org');
  });

  test('TC002: an account in two companies switches between them without signing in again', async ({b2bPage}) => {
    // The Console's "Affiliations" setup from the sample's README, through the API: two companies
    // and an account in the Default organization unit shared into every company beneath it.
    const alpha = newCompany('react-b2b-alpha');
    const beta = newCompany('react-b2b-beta');
    await createChildOrganizationUnit(alpha.handle, alpha.name);
    await createChildOrganizationUnit(beta.handle, beta.name);
    const user = await createDefaultOuUser(USER_TYPE, {
      email: alpha.email,
      password: alpha.password,
      username: alpha.username,
    });
    await shareUserWithAllChildUnits(user.id);

    await b2bPage.goto(appUrl);
    await b2bPage.clickSignInButton();
    await b2bPage.login(alpha.username, alpha.password);
    await b2bPage.chooseCompany(alpha.handle);
    await b2bPage.verifySignedInTo(alpha.name);
    expect(await b2bPage.claim('ouHandle')).toBe(alpha.handle);

    await b2bPage.switchTo(alpha.name, beta.name);
    await b2bPage.verifySignedInTo(beta.name);
    expect(await b2bPage.claim('ouHandle')).toBe(beta.handle);
  });

  test('TC003: signs out after registering a company', async ({b2bPage}) => {
    const company = newCompany('react-b2b');
    await b2bPage.goto(appUrl);
    await b2bPage.clickSignInButton();
    await b2bPage.registerCompany(company, 'My account belongs to this company');
    await b2bPage.verifySignedInTo(company.name);

    await b2bPage.logout();
    await b2bPage.verifyLoggedOut();
  });
});
