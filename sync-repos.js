#!/usr/bin/env node
'use strict';

/**
 * sync-repos.js
 *
 * Called by the "Sync GitHub Repositories" GitHub Actions workflow.
 * Fetches every public GitHub Pages repository owned by OWNER, then
 * appends cards for any that are not already listed in links.json and
 * not listed in removed.json (permanent exclusion list).
 */

const fs = require('fs');

const OWNER = 'galvinradleyngo';
const LINKS_FILE = 'links.json';
const REMOVED_FILE = 'removed.json';

async function fetchAllRepos(token) {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'gvibe-sync-action',
  };

  const repos = [];
  let page = 1;
  while (true) {
    const url =
      `https://api.github.com/users/${OWNER}/repos` +
      `?per_page=100&page=${page}&sort=created&direction=desc`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(
        `GitHub API failed on page ${page} (${url}): ${res.status} ${await res.text()}`
      );
    }
    const batch = await res.json();
    repos.push(...batch);
    if (batch.length < 100) break;
    page++;
  }

  return repos;
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN environment variable is not set.');

  let linksData, removedRepos;
  try {
    linksData = JSON.parse(fs.readFileSync(LINKS_FILE, 'utf8'));
  } catch (err) {
    throw new Error(`Failed to read ${LINKS_FILE}: ${err.message}`);
  }
  try {
    removedRepos = JSON.parse(fs.readFileSync(REMOVED_FILE, 'utf8'));
  } catch (err) {
    throw new Error(`Failed to read ${REMOVED_FILE}: ${err.message}`);
  }

  const currentUrls = new Set((linksData.links || []).map((l) => l.url));
  const removedSet = new Set(removedRepos);

  const allRepos = await fetchAllRepos(token);

  const newEntries = [];
  for (const repo of allRepos) {
    if (repo.private || !repo.has_pages || removedSet.has(repo.name)) continue;
    const pagesUrl = `https://${OWNER}.github.io/${repo.name}/`;
    if (!currentUrls.has(pagesUrl)) {
      newEntries.push({
        name: repo.name,
        url: pagesUrl,
        description: repo.description || '',
      });
    }
  }

  if (newEntries.length === 0) {
    console.log('No new repositories to add.');
    return;
  }

  linksData.links = [...(linksData.links || []), ...newEntries];
  fs.writeFileSync(LINKS_FILE, JSON.stringify(linksData, null, 2) + '\n');
  console.log(
    `Added ${newEntries.length} new card(s): ${newEntries.map((e) => e.name).join(', ')}`
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
