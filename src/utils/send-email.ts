import { FormData } from "@/app/components/FormSuperLite/FormSuperLite";

export function sendEmail(data: FormData) {
  const apiEndpoint = "/api/email";

  fetch(apiEndpoint, {
    method: "POST",
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(response => {
      alert(response.message);
    })
    .catch(err => {
      alert(err);
    });
}
