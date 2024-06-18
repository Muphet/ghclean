require('dotenv').config()
const axios = require('axios')

const username = process.env.GITHUB_USERNAME
const token = process.env.GITHUB_TOKEN

const reposUrl = `https://api.github.com/users/${username}/repos`
const deleteRepo = async (repoName) => {
    const url = `https://api.github.com/repos/${username}/${repoName}`
    try {
        await axios.delete(url, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        console.log(`deleted repository: ${repoName}`)
    } catch (error) {
        console.error(`failed to delete repository: ${repoName}`, error)
    }
}

const main = async () => {
    try {
        const response = await axios.get(reposUrl, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        const repositories = response.data
        const forkedRepos = repositories.filter(repo => repo.fork)

        console.log(`found ${forkedRepos.length} forked repositories.`)

        for (const repo of forkedRepos) {
            await deleteRepo(repo.name)
        }

        console.log('completed deleting forked repositories.')
    } catch (error) {
        console.error('error fetching repositories', error)
    }
}

main();