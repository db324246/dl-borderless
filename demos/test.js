const data = [
  {
    "childesList": [
      {
        "childesList": [],
        id:5,
        "person": 67
      }
    ],
    "id": 123,
    "leadership": 114,
    "leadershipNumber": "2022999",
    "leadershipPhoto": "",
    "leadershipStr": "超级管理员-",
    "organizationId": 1,
    "organizationName": "大桥院集团",
    "parentId": 0,
    "person": 114,
    "personNumber": "2022999",
    "personPhoto": "",
    "personStr": "超级管理员-",
    "projectId": 55,
    "rolesUnit": 201,
    "rolesUnitIdentifier": "main_responsibility",
    "rolesUnitStr": "主责单位",
    "unitMembersList": [
      3351
    ],
    "unitMembersListStr": [
      {
        "id": 131,
        "number": "2011034",
        "photo": "",
        "unitId": 123,
        "userId": 3351,
        "userName": "沙小兵"
      }
    ]
  },
  {
    "childesList": [],
    "id": 124,
    "leadership": 6190,
    "leadershipNumber": "745",
    "leadershipPhoto": "human/2/9cfefb6acdbe495ea3a2946901934f5e.jpg",
    "leadershipStr": "测试一下",
    "organizationId": 274,
    "organizationName": "领导高管",
    "parentId": 0,
    "person": 6190,
    "personNumber": "745",
    "personPhoto": "human/2/9cfefb6acdbe495ea3a2946901934f5e.jpg",
    "personStr": "测试一下",
    "projectId": 55,
    "rolesUnit": 202,
    "rolesUnitIdentifier": "synergy",
    "rolesUnitStr": "协同单位",
    "unitMembersList": [
      3351
    ],
    "unitMembersListStr": [
      {
        "id": 132,
        "number": "2011034",
        "photo": "",
        "unitId": 124,
        "userId": 3351,
        "userName": "沙小兵"
      }
    ]
  }
]

function recursion(data = []) {
  return data.map(item => {
    return {
      key: item.id,
      data: item,
      children: recursion(item.childesList)
    }
  })
}


// {
//    "root":[
//     {key:'',
//     data:{},
//     children:[
//     {key:'',
//     data:{},
//     children:[]}

//     ]
// }

//    ]
// }
  

