interface EnhanceOptions {
  pending?: (data: FormData, form: HTMLFormElement) => void;
  error?: (resOrError: Response | Error, form: HTMLFormElement) => void;
  result: (res: Response, form: HTMLFormElement) => void;
}

export function enhance(form: HTMLFormElement, { pending, error, result }: EnhanceOptions) {
  async function submitForm(e: SubmitEvent) {
    const body = new FormData(form);

    if (pending) {
      pending(body, form);
    }

    try {
      const res = await fetch(form.action, {
        method: form.method,
        headers: {
          accept: 'application/json',
        },
        body,
      });
  
      if (res.ok) {
        result(res, form);
      } else if (error) {
        error(res, form);
      } else {
        console.error(await res.text())
      }
    } catch (e) {
      if (error) {
        error(e, form);
      } else {
        throw e;
      }
    }
  }

  form.addEventListener('submit', submitForm);

  return {
    destroy() {
      form.removeEventListener('submit', submitForm);
    }
  }
}