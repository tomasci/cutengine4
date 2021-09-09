import express from "express"
import Response from "../../utils/Response/Response"
import db from "../../utils/Database/Database"
// import {mc_addons, site_posts} from "../../../prisma/client"
import Config from "../../utils/Config"

interface Limit {
	startPoint: number
	rowsCount: number
}

const postsPerPage = Config.sitePosts.perPage

async function getByPage(
	req: express.Request,
	res: express.Response
): Promise<void> {
	const page = Number(req.params.page)
	const isNumber = Boolean(page)

	if (!isNumber) {
		Response(res, {
			error: true,
			code: 500,
			message: "Page value must be Number. #202131208164400",
		})
		return
	}

	const limit = computeLimit(page)
	const posts = await getPosts(limit)
	const pages = await computePagesCount()

	if (posts.length < 1) {
		Response(res, {
			error: true,
			code: 404,
			message: "Page not found. #202131208171300",
		})
		return
	}

	Response(
		res,
		{
			error: false,
		},
		{
			posts,
			pages,
		}
	)
	return
}

function computeLimit(page: number): Limit {
	// select * from site_posts order by updatedAt desc limit 0, 1;

	return {
		startPoint: page * postsPerPage - postsPerPage,
		rowsCount: postsPerPage,
	}
}

async function computePagesCount(): Promise<number> {
	const postsCount = await db.mc_addons.count({
		where: {
			isPublished: true,
		},
	})
	return Math.ceil(postsCount / postsPerPage)
}

async function getPosts(limit: Limit) {
	return db.mc_addons.findMany({
		skip: limit.startPoint,
		take: limit.rowsCount,
		orderBy: [
			{
				updatedAt: "desc",
			},
		],
		where: {
			isPublished: true,
		},
	})
	// return db.site_posts.findMany({
	// 	skip: limit.startPoint,
	// 	take: limit.rowsCount,
	// 	orderBy: [
	// 		{
	// 			updatedAt: "desc",
	// 		},
	// 	],
	// 	include: {
	// 		site_post_attachments: {
	// 			include: {
	// 				mc_addons: true,
	// 			},
	// 		},
	// 	},
	// })
}

export default getByPage
