// import express from "express"
// import Response from "../../utils/Response/Response"
// import db from "../../utils/Database/Database"
// import {site_posts} from "../../../prisma/client"
//
// async function getMod(req: express.Request, res: express.Response) {
// 	let postID = Number(req.params.id)
//
// 	if (!Boolean(postID)) {
// 		return Response(res, {
// 			error: true,
// 			code: 500,
// 			message: "Post ID must be Number. #202131108200300",
// 		})
// 	}
//
// 	let exists = await isExists(postID)
// 	if (!exists) {
// 		return Response(res, {
// 			error: true,
// 			code: 404,
// 			message: "Not Found. #202131108220400",
// 		})
// 	}
//
// 	let post = await getPost(postID)
//
// 	return Response(
// 		res,
// 		{
// 			error: false,
// 		},
// 		{
// 			post,
// 		}
// 	)
// }
//
// async function isExists(id: number): Promise<boolean> {
// 	let search = await db.site_posts.count({
// 		where: {
// 			id: id,
// 		},
// 	})
//
// 	return search > 0
// }
//
// async function getPost(id: number): Promise<site_posts> {
// 	return db.site_posts.findUnique({
// 		where: {
// 			id: id,
// 		},
// 		include: {
// 			site_post_attachments: {
// 				include: {
// 					mc_addons: true,
// 				},
// 			},
// 		},
// 	})
// }
//
// export default getMod
