import {
  firebase_user,
  admin_user,
  anonymous_user,
  general_user,
  nonactive_user,
  sub_user,
} from "./testData";
import { genErrorObj } from "../../backend/lib/utilities";
import { testTokens } from "./testData";
import initDB from "./initDB";

beforeAll(async () => await initDB());

jest.spyOn(console, "error").mockImplementation(() => {});

jest.mock("../../backend/lib/firebaseAdmin", () => ({
  verifyToken: (token: string) => {
    if (token == testTokens.admin_user) {
      return admin_user;
    }

    if (token === testTokens.firebase_user) {
      return firebase_user;
    }

    if (token === testTokens.general_user) {
      return general_user;
    }

    if (token === testTokens.anonymous_user) {
      return anonymous_user;
    }

    if (token === testTokens.nonactive_user) {
      return nonactive_user;
    }

    if (token === testTokens.sub_user) {
      return sub_user;
    }

    return genErrorObj(400, "ID token has invalid signature");
  },
}));

jest.mock("next/router", () => ({
  useRouter() {
    return {
      locale: "en",
    };
  },
}));

// jest.mock("../../frontend/lib/firebaseApp", () => ({
//   client_auth: {
//     onAuthStateChanged: (func: any) => {
//       func({
//         accessToken:
//           "eyJhbGciOiJSUzI1NiIsImtpZCI6IjUyZmEwZjE2NmJmZjZiODU5N2FjMGFlMDRlNTllZmYxOTk1N2MyYmIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVGFrZSBOaXdhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdoRmZRRUtFSnJHOTlfRW1vdjFhVlQxYjk0UE8wS3psVTVsdWdkY1lRPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3J1aHVuYS1kZXYiLCJhdWQiOiJydWh1bmEtZGV2IiwiYXV0aF90aW1lIjoxNjYxODcxOTc2LCJ1c2VyX2lkIjoicElDRVFSd3llV2Q5QXU4ZGJiR3FTVnF6ckt4MSIsInN1YiI6InBJQ0VRUnd5ZVdkOUF1OGRiYkdxU1ZxenJLeDEiLCJpYXQiOjE2NjE4NzE5NzYsImV4cCI6MTY2MTg3NTU3NiwiZW1haWwiOiJuaXdheWFtYTExMDFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDI3NTI5NTUyNDg5MDQ0NDUxMzEiXSwiZW1haWwiOlsibml3YXlhbWExMTAxQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.F3qnCNLGwBS_BlvP9GcWWTkTgI0cHYKeKPJm09hwoS3ARZ6HoVK0svJAhxk3y80JW1jOjzkh85rzCDADNtBAX2f3cdAjfS4IKud9llYw0Bs1it0VVt8XvFuYRO8rhqR22OahTPNnWAA_Lzt3M__IMB2ojtH___nlZIiymzcDZ5T1DVYodzYNlwdFvYMnriyM80NFFYmKqAkEHVK-FJPEjezFvgBdhv7fJLCoJ11BdGH5Lg_EcBKj20Cwi6QHiKLExdfXIq9kLh5aPc0ASn9NDhna5B6Em6I1VXgD3qYrJJNVH0Ucaangm3Rh7nbGlQiuzTbwJmlv4lpNdoJ72F1w4Q",
//         displayName: "Niwa test",
//         email: "niwa_test@gmail.com",
//         emailVerified: true,
//         isAnonymous: false,
//         metadata: {
//           UserMetadata: {
//             createdAt: "1636298621853",
//             lastLoginAt: "1661871976882",
//             lastSignInTime: "Tue, 30 Aug 2022 15:06:16 GMT",
//             creationTime: "Sun, 07 Nov 2021 15:23:41 GMT",
//           },
//         },
//         phoneNumber: null,
//         photoURL:
//           "https://lh3.googleusercontent.com/a-/AOh14GhFfQEKEJrG99_Emov1aVT1b94PO0KzlU5lugdcYQ=s96-c",
//         providerData: [
//           {
//             0: {
//               displayName: "Niwa test",
//               email: "niwa_test@gmail.com",
//               phoneNumber: null,
//               photoURL:
//                 "https://lh3.googleusercontent.com/a-/AFdZucrt5ThnjVU4ML930hDh-44LbE9IqWAsDYTr2KRqtg=s96-c",
//               providerId: "google.com",
//               uid: "102752955248904445131",
//             },
//           },
//         ],
//         providerId: "firebase",
//         reloadListener: null,
//         stsTokenManager: {
//           StsTokenManager: {
//             refreshToken:
//               "AOEOulbsicCcd1BSIFP3xdZfSSRcK33_UWYWt69Kp1wB7ycNC7…o-oRqa9c1B4qXQ8cNFMMXrwzTONSr2Eaam4Q_7774CCCONWJQ",
//             accessToken:
//               "eyJhbGciOiJSUzI1NiIsImtpZCI6IjUyZmEwZjE2NmJmZjZiOD…qYrJJNVH0Ucaangm3Rh7nbGlQiuzTbwJmlv4lpNdoJ72F1w4Q",
//             expirationTime: 1661875576944,
//           },
//         },
//         tenantId: null,
//         uid: "pICEQRwyeWd9Au8dbbGqSVqzrKx1",
//         refreshToken:
//           "AOEOulbsicCcd1BSIFP3xdZfSSRcK33_UWYWt69Kp1wB7ycNC7FR1FCVHAT--hn9MqlcNzbd2iTS-AkSjz_Bra3ASO5eSj5HElQoFFacfMmbGt-FdMva3YulxhaGDyMGE7KnaSdbmvdO-it2HnnYakB_Paw8Zjfq9kgLVv91KhWInhGJK6mqkrHXqZNr9BnaBXiGzGf5mIb_cZiy60U1h1obpZQ2c5dCIEUxZMLHB2uqhIT_G2PK_FYyBRxSgh_s_c4vt5CJ95G_XrUrvC5Q4mu8TmfOCqxCKbkDg2RCFrI67CXDBJQs_LtcUIVqkYF4LUn_RkQUDIXZxc3HkAtW7AIyQxJFakpK7Q2NB6UHGy6LDYxZao-oRqa9c1B4qXQ8cNFMMXrwzTONSr2Eaam4Q_7774CCCONWJQ",
//       });
//     },
//   },
//   signupWithGoogle: () => {},
//   signupWithEmail: () => {},
// }));
