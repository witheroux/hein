interface EnhanceOptions {
  error?: (res: Response | Error, form: HTMLFormElement) => void;
  pending?: (data: FormData, form: HTMLFormElement) => void;
  result: (res: Response, form: HTMLFormElement) => void;
  validate?: boolean;
}

export function checkValidity(form: HTMLFormElement) {
  async function checkOnSubmit(e: SubmitEvent): Promise<void> {
    if (!form.checkValidity()) {
      e.preventDefault();
      form.querySelectorAll<HTMLElement>(':invalid')[0]?.focus();
    }
  }

  form.noValidate = true;

  form.addEventListener('submit', checkOnSubmit, true);

  return {
    destroy() {
      form.removeEventListener('submit', checkOnSubmit, true);
    }
  }
}

export function enhance(form: HTMLFormElement, { error, pending, result, validate }: EnhanceOptions) {
  async function submitForm(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    const body = new FormData(form);

    if (pending) {
      pending(body, form);
    }

    if (validate && !form.checkValidity()) {
      form.querySelectorAll<HTMLElement>(':invalid')[0]?.focus();
      return;
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

  if (validate) {
    form.noValidate = true;
  }

  form.addEventListener('submit', submitForm);

  return {
    destroy() {
      form.removeEventListener('submit', submitForm);
    }
  }
}